//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.8-b130911.1802 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2015.05.07 at 01:41:53 PM EDT 
//


package org.hl7.fhir;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * If the element is present, it must have a value for
 * 				at least one of the defined elements, an @id referenced from the
 * 				Narrative, or extensions
 * 			
 * 
 * <p>Java class for Ratio complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="Ratio">
 *   &lt;complexContent>
 *     &lt;extension base="{http://hl7.org/fhir}Element">
 *       &lt;sequence>
 *         &lt;element name="numerator" type="{http://hl7.org/fhir}Quantity" minOccurs="0"/>
 *         &lt;element name="denominator" type="{http://hl7.org/fhir}Quantity" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Ratio", propOrder = {
    "numerator",
    "denominator"
})
public class Ratio
    extends Element
{

    protected Quantity numerator;
    protected Quantity denominator;

    /**
     * Gets the value of the numerator property.
     * 
     * @return
     *     possible object is
     *     {@link Quantity }
     *     
     */
    public Quantity getNumerator() {
        return numerator;
    }

    /**
     * Sets the value of the numerator property.
     * 
     * @param value
     *     allowed object is
     *     {@link Quantity }
     *     
     */
    public void setNumerator(Quantity value) {
        this.numerator = value;
    }

    /**
     * Gets the value of the denominator property.
     * 
     * @return
     *     possible object is
     *     {@link Quantity }
     *     
     */
    public Quantity getDenominator() {
        return denominator;
    }

    /**
     * Sets the value of the denominator property.
     * 
     * @param value
     *     allowed object is
     *     {@link Quantity }
     *     
     */
    public void setDenominator(Quantity value) {
        this.denominator = value;
    }

}
